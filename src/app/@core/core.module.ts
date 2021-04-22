import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule, NbDummyAuthStrategy } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';


// const DATA_SERVICES = [
//   { provide: Us"erData, useClass: UserService },
//   { provide: StatsBarData, useClass: StatsBarService },
//   { provide: StatsProgressBarData, useClass: StatsProgressBarService },
//   { provide: ProfitBarAnimationChartData, useClass: ProfitBarAnimationChartService },
//   { provide: TrafficBarData, useClass: TrafficBarService },
//   { provide: TrafficListData, useClass: TrafficListService },
//   { provide: OrdersChartData, useClass: OrdersChartService },
//   { provide: OrdersProfitChartData, useClass: OrdersProfitChartService },
//   { provide: UserActivityData, useClass: UserActivityService },
//   { provide: SecurityCamerasData, useClass: SecurityCamerasService },
// ];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [
  //   ...DATA_SERVICES,
  ...NbAuthModule.forRoot({

    strategies: [
      NbDummyAuthStrategy.setup({
        name: 'email',
        delay: 3000,
      }),
    ],
    // forms: {
    //   login: {
    //     socialLinks: socialLinks,
    //   },
    //   register: {
    //     socialLinks: socialLinks,
    //   },
    // },
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,
  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  }
  //   AnalyticsService,
  //   LayoutService,
  //   PlayerService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
